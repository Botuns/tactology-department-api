import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Department } from '../entities/department.entity';

@ObjectType()
export class PaginatedDepartmentsResponse {
  @Field(() => [Department])
  items: Department[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  take: number;
}
