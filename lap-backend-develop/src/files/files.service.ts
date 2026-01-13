import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { FileRepository } from './infrastructure/persistence/file.repository';
import { FileType } from './domain/file';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileRepository: FileRepository,
  ) {}

  async create(
    file: Express.Multer.File | Express.MulterS3.File,
  ): Promise<FileType> {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const FILE_DRIVER = this.configService.getOrThrow('file.driver', {
      infer: true,
    });

    let path;
    if (FILE_DRIVER === 'local') {
      path = `/${this.configService.get('app.apiPrefix', { infer: true })}/v1/${
        file.path
      }`;
    } else if (FILE_DRIVER === 's3') {
      path =
        (file as Express.MulterS3.File).path ||
        (file as Express.MulterS3.File).location;
    } else {
      throw new Error('Invalid FILE_DRIVER configuration');
    }

    return this.fileRepository.create({ path: path });
  }

  findOne(fields: EntityCondition<FileType>): Promise<NullableType<FileType>> {
    return this.fileRepository.findOne(fields);
  }

  async findOrCreate(
    file: Express.Multer.File | Express.MulterS3.File,
  ): Promise<FileType> {
    try {
      const FILE_DRIVER = this.configService.getOrThrow('file.driver', {
        infer: true,
      });

      let path;
      if (FILE_DRIVER === 'local') {
        path = `/${this.configService.get('app.apiPrefix', {
          infer: true,
        })}/v1/${file.path}`;
      } else if (FILE_DRIVER === 's3') {
        path =
          (file as Express.MulterS3.File).path ||
          (file as Express.MulterS3.File).location;
      } else {
        throw new Error('Invalid FILE_DRIVER configuration');
      }

      let existingFile = await this.findOne({ path: path });

      if (!existingFile) {
        existingFile = await this.fileRepository.create({ path: path });
      }

      return existingFile;
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error finding or creating file',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
