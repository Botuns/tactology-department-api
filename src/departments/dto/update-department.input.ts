import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, MinLength, IsNumber, IsPositive } from 'class-validator';

@InputType()
export class UpdateDepartmentInput {
  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  id: number;

  @Field()
  @IsNotEmpty({ message: 'Department name is required' })
  @MinLength(2, {
    message: 'Department name must be at least 2 characters long',
  })
  name: string;
}
