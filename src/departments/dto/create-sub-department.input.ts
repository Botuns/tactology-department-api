/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateSubDepartmentInput {
  @Field()
  @IsNotEmpty({ message: 'Sub-department name is required' })
  @MinLength(2, {
    message: 'Sub-department name must be at least 2 characters long',
  })
  name: string;
}
