import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AdminLoginInput {
  @Field(() => String, { description: 'Email Address' })
  email: string;

  @Field(() => String, { description: 'Password' })
  password: string;
}
