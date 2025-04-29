import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength, IsNumber, IsPositive } from 'class-validator';

@InputType()
export class UpdateSubDepartmentInput {
  @Field(() => ID)
  @IsNumber()
  @IsPositive()
  id: number;

  @Field()
  @IsNotEmpty({ message: 'Sub-department name is required' })
  @MinLength(2, {
    message: 'Sub-department name must be at least 2 characters long',
  })
  name: string;
}
