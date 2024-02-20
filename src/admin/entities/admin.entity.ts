import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Admin {
  @Field(() => Int, { description: 'Admin id' })
  id: number;

  @Field(() => String, { description: 'Admin email address' })
  email: string;

  @Field(() => String, { description: 'Admin password' })
  password: string;
}
