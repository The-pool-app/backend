import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { DatabaseService } from 'src/database/database.service';
import { User, Admin } from './entities';
import { AdminLoginInput, CreateAdminInput, UpdateAdminInput } from './dto';

@Resolver(() => Admin)
export class AdminResolver {
  constructor(
    private readonly adminService: AdminService,
    private database: DatabaseService,
  ) {}

  @Mutation(() => Admin)
  createAdmin(@Args('createAdminInput') createAdminInput: CreateAdminInput) {
    return this.adminService.create(createAdminInput);
  }

  @Mutation(() => Admin)
  login(@Args('login') LoginDto: AdminLoginInput) {
    return this.adminService.create(LoginDto);
  }

  @Mutation(() => Admin)
  changePassword(
    @Args('changePasswordInput') changePasswordDto: CreateAdminInput,
  ) {
    return this.adminService.create(changePasswordDto);
  }

  @Query(() => User!)
  findAllUsers() {
    try {
      return this.database
        .$executeRaw`SELECT email FROM personal_details LIMIT 100`;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Query(() => Admin, { name: 'admin' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.adminService.findOne(id);
  }

  @Mutation(() => Admin)
  updateAdmin(@Args('updateAdminInput') _updateAdminInput: UpdateAdminInput) {
    return this.adminService.update(_updateAdminInput.id);
  }

  @Mutation(() => Admin)
  removeAdmin(@Args('id', { type: () => Int }) id: number) {
    return this.adminService.remove(id);
  }
}
