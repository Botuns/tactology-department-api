import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentsRepository } from './repositories/departments.repository';
import { Department } from './entities/department.entity';
import { SubDepartment } from './entities/sub-department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';
import { CreateSubDepartmentInput } from './dto/create-sub-department.input';
import { UpdateSubDepartmentInput } from './dto/update-sub-department.input';
import { PaginationArgs } from './dto/pagination.args';

@Injectable()
export class DepartmentsService {
  constructor(private departmentsRepository: DepartmentsRepository) {}

  async findAll(paginationArgs?: PaginationArgs): Promise<Department[]> {
    if (paginationArgs) {
      const { skip, take } = paginationArgs;
      return this.departmentsRepository.findAll(skip, take);
    }
    return this.departmentsRepository.findAll();
  }

  async count(): Promise<number> {
    return this.departmentsRepository.count();
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentsRepository.findOne(id);
    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }
    return department;
  }

  async create(
    createDepartmentInput: CreateDepartmentInput,
  ): Promise<Department> {
    return this.departmentsRepository.create(createDepartmentInput);
  }

  async update(
    updateDepartmentInput: UpdateDepartmentInput,
  ): Promise<Department> {
    const { id, name } = updateDepartmentInput;
    const department = await this.departmentsRepository.update(id, name);
    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }
    return department;
  }

  async remove(id: number): Promise<boolean> {
    const exists = await this.departmentsRepository.findOne(id);
    if (!exists) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }
    return this.departmentsRepository.delete(id);
  }

  // Sub-department methods
  async createSubDepartment(
    departmentId: number,
    createSubDepartmentInput: CreateSubDepartmentInput,
  ): Promise<SubDepartment> {
    try {
      return await this.departmentsRepository.createSubDepartment(
        departmentId,
        createSubDepartmentInput,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new NotFoundException(
        `Department with ID "${departmentId}" not found : ${errorMessage}`,
      );
    }
  }
  async updateSubDepartment(
    updateSubDepartmentInput: UpdateSubDepartmentInput,
  ): Promise<SubDepartment> {
    const { id, name } = updateSubDepartmentInput;
    const subDepartment = await this.departmentsRepository.updateSubDepartment(
      id,
      name,
    );
    if (!subDepartment) {
      throw new NotFoundException(`Sub-department with ID "${id}" not found`);
    }
    return subDepartment;
  }

  async removeSubDepartment(id: number): Promise<boolean> {
    const exists = await this.departmentsRepository.findSubDepartment(id);
    if (!exists) {
      throw new NotFoundException(`Sub-department with ID "${id}" not found`);
    }
    return this.departmentsRepository.deleteSubDepartment(id);
  }
  async findSubDepartment(id: number): Promise<SubDepartment> {
    const subDepartment =
      await this.departmentsRepository.findSubDepartment(id);
    if (!subDepartment) {
      throw new NotFoundException(`Sub-department with ID "${id}" not found`);
    }
    return subDepartment;
  }
}
