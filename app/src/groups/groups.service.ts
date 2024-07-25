import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
// import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService){}
  
  async create(createGroupDto: CreateGroupDto) {
    try {
      return await this.prisma.groups.create({
        data: {
          name: createGroupDto.name
        },
      });
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.prisma.groups.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });    
  }

  findNumbers() {
    return this.prisma.phoneNumbers.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });    
  }  

  async processCsv(filePath: string, groupId: number) {
    const results = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', async () => {
          try {
            for (const row of results) {              
              const columns = Object.keys(row);
              if (columns.length < 2) {
                throw new BadRequestException('CSV file must contain at least two columns for name and number.');
              }

              const name = row[columns[0]];
              const number = row[columns[1]];

              if (!name || !number) {
                throw new BadRequestException('CSV file rows must have both name and number.');
              }

              await this.prisma.phoneNumbers.create({
                data: {
                  name: name,
                  number: number,
                  groupId: groupId,
                },
              });
            }
            resolve({ message: 'File uploaded and processed successfully' });
          } catch (error) {
            reject(new BadRequestException('Failed to process CSV file.'));
          }
        })
        .on('error', (error) => {
          reject(new BadRequestException('Failed to read CSV file.'));
        });
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} group`;
  // }

  // update(id: number, updateGroupDto: UpdateGroupDto) {
  //   return `This action updates a #${id} group`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} group`;
  // }
}
