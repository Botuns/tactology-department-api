import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  MinLength,
  ValidateNested,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';
import { CreateSubDepartmentInput } from './create-sub-department.input';

@InputType()
export class CreateDepartmentInput {
  @Field()
  @IsNotEmpty({ message: 'Department name is required' })
  @MinLength(2, {
    message: 'Department name must be at least 2 characters long',
  })
  name: string;

  @Field(() => [CreateSubDepartmentInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSubDepartmentInput)
  @ArrayMinSize(0)
  subDepartments?: CreateSubDepartmentInput[];
}
