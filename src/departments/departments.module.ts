import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { SubDepartment } from './entities/sub-department.entity';
import { DepartmentsService } from './departments.service';
import { DepartmentsResolver } from './departments.resolver';
import { DepartmentsRepository } from './repositories/departments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Department, SubDepartment])],
  providers: [DepartmentsService, DepartmentsResolver, DepartmentsRepository],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
