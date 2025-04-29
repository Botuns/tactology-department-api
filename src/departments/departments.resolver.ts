import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';
import { SubDepartment } from './entities/sub-department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';
import { CreateSubDepartmentInput } from './dto/create-sub-department.input';
import { UpdateSubDepartmentInput } from './dto/update-sub-department.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationArgs } from './dto/pagination.args';
import { PaginatedDepartmentsResponse } from './dto/paginated-departments.response';

@Resolver(() => Department)
export class DepartmentsResolver {
  constructor(private departmentsService: DepartmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Department], { name: 'departments' })
  async getDepartments(@Args() paginationArgs: PaginationArgs) {
    return this.departmentsService.findAll(paginationArgs);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Department, { name: 'department' })
  async getDepartment(@Args('id', { type: () => ID }) id: number) {
    return this.departmentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Department)
  async createDepartment(
    @Args('input') createDepartmentInput: CreateDepartmentInput,
  ) {
    return this.departmentsService.create(createDepartmentInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Department)
  async updateDepartment(
    @Args('input') updateDepartmentInput: UpdateDepartmentInput,
  ) {
    return this.departmentsService.update(updateDepartmentInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteDepartment(@Args('id', { type: () => ID }) id: number) {
    return this.departmentsService.remove(id);
  }
  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedDepartmentsResponse, { name: 'paginatedDepartments' })
  async getPaginatedDepartments(@Args() paginationArgs: PaginationArgs) {
    const [items, total] = await Promise.all([
      this.departmentsService.findAll(paginationArgs),
      this.departmentsService.count(),
    ]);

    return {
      items,
      total,
      skip: paginationArgs.skip,
      take: paginationArgs.take,
    };
  }

  // Sub-department operations
  @UseGuards(JwtAuthGuard)
  @Mutation(() => SubDepartment)
  async createSubDepartment(
    @Args('departmentId', { type: () => ID }) departmentId: number,
    @Args('input') createSubDepartmentInput: CreateSubDepartmentInput,
  ) {
    return this.departmentsService.createSubDepartment(
      departmentId,
      createSubDepartmentInput,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => SubDepartment, { name: 'subDepartment' })
  async getSubDepartment(@Args('id', { type: () => ID }) id: number) {
    return this.departmentsService.findSubDepartment(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => SubDepartment)
  async updateSubDepartment(
    @Args('input') updateSubDepartmentInput: UpdateSubDepartmentInput,
  ) {
    return this.departmentsService.updateSubDepartment(
      updateSubDepartmentInput,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteSubDepartment(@Args('id', { type: () => ID }) id: number) {
    return this.departmentsService.removeSubDepartment(id);
  }
}
