/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import { SubDepartment } from '../entities/sub-department.entity';
import { CreateDepartmentInput } from '../dto/create-department.input';
import { CreateSubDepartmentInput } from '../dto/create-sub-department.input';
import { count } from 'console';

@Injectable()
export class DepartmentsRepository {
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    @InjectRepository(SubDepartment)
    private subDepartmentsRepository: Repository<SubDepartment>,
  ) {}

  async findAll(skip?: number, take?: number): Promise<Department[]> {
    const options: any = {
      relations: ['subDepartments'],
    };

    if (typeof skip === 'number' && typeof take === 'number') {
      options.skip = skip;
      options.take = take;
    }

    return this.departmentsRepository.find(options);
  }

  findOne(id: number): Promise<Department | null> {
    return this.departmentsRepository.findOne({
      where: { id },
      relations: ['subDepartments'],
    });
  }

  async create(input: CreateDepartmentInput): Promise<Department> {
    // Create the department
    const department = this.departmentsRepository.create({
      name: input.name,
    });

    const savedDepartment = await this.departmentsRepository.save(department);

    // Create sub-departments if provided
    if (input.subDepartments && input.subDepartments.length > 0) {
      const subDepartments = input.subDepartments.map((subDeptInput) =>
        this.subDepartmentsRepository.create({
          ...subDeptInput,
          department: savedDepartment,
        }),
      );

      await this.subDepartmentsRepository.save(subDepartments);
      savedDepartment.subDepartments = subDepartments;
    } else {
      savedDepartment.subDepartments = [];
    }

    return savedDepartment;
  }

  async update(id: number, name: string): Promise<Department | null> {
    const department = await this.findOne(id);
    if (!department) return null;

    department.name = name;
    return this.departmentsRepository.save(department);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.departmentsRepository.delete(id);
    return (
      result.affected !== null &&
      result.affected !== undefined &&
      result.affected > 0
    );
  }

  // Sub-department specific methods
  async createSubDepartment(
    departmentId: number,
    input: CreateSubDepartmentInput,
  ): Promise<SubDepartment> {
    const department = await this.findOne(departmentId);
    if (!department) {
      throw new Error('Department not found');
    }

    const subDepartment = this.subDepartmentsRepository.create({
      ...input,
      department,
    });

    return this.subDepartmentsRepository.save(subDepartment);
  }

  findSubDepartment(id: number): Promise<SubDepartment | null> {
    return this.subDepartmentsRepository.findOne({
      where: { id },
      relations: ['department'],
    });
  }

  async updateSubDepartment(
    id: number,
    name: string,
  ): Promise<SubDepartment | null> {
    const subDepartment = await this.findSubDepartment(id);
    if (!subDepartment) return null;

    subDepartment.name = name;
    return this.subDepartmentsRepository.save(subDepartment);
  }

  async deleteSubDepartment(id: number): Promise<boolean> {
    const result = await this.subDepartmentsRepository.delete(id);
    return (
      result.affected !== null &&
      result.affected !== undefined &&
      result.affected > 0
    );
  }
  async count(): Promise<number> {
    const count = await this.departmentsRepository.count();
    return count;
  }
}
