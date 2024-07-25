import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, BadRequestException, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AuthGuard } from '@nestjs/passport';
import * as csvParser from 'csv-parser';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer'
import { extname, join } from 'path';
// import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('groups')
// @UseGuards(AuthGuard('jwt'))
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get('numbers')
  findNumbers() {
    return this.groupsService.findNumbers();
  }  

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: "./uploads",
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'text/csv') {
        return cb(new BadRequestException('Only CSV files are allowed!'), false);
      }
      cb(null, true);
    }    
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('group', ParseIntPipe) groupId: number) {

    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    if (!groupId) {
      throw new HttpException('Group ID is missing', HttpStatus.BAD_REQUEST);
    }
    
    try {
      const filePath = join(__dirname, '..', '..', 'uploads', file.filename);
      return await this.groupsService.processCsv(filePath, groupId);
    } catch (error) {
      throw new HttpException('Failed to process file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.groupsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
  //   return this.groupsService.update(+id, updateGroupDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.groupsService.remove(+id);
  // }
}
