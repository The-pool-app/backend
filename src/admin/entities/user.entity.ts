import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String, { description: 'User id' })
  id: string;

  @Field(() => String, { description: 'User email address' })
  email: string;

  @Field(() => String, { description: 'User fullname' })
  fullName: string;
}
