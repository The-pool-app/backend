import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';
import { DatabaseService } from 'src/database/database.service';
import { CreatePlanDto, UpdatePlanDto } from './dto';
import { ResponseStatus } from 'src/utils/types';
import { UserRole } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(
    private config: ConfigService,
    private database: DatabaseService,
  ) {}
  async create(dto: CreatePlanDto): Promise<ResponseStatus> {
    try {
      const newPlan = await this.database.subscription_type.create({
        data: {
          name: dto.planName,
          description: dto.description,
          price: Number(dto.price),
          planId: dto.planId,
          category: dto.category,
          expiresIn: dto.duration, // Convert duration to a string
        },
      });
      return {
        success: true,
        message: 'Plan created successfully',
        data: newPlan,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async updatePlan(planId, dto: UpdatePlanDto): Promise<ResponseStatus> {
    try {
      const updatedPlan = await this.database.subscription_type.update({
        where: {
          id: Number(planId),
        },
        data: {
          name: dto.planName,
          description: dto.description,
          planId: dto.planId,
          category: dto.category,
          expiresIn: dto.duration, // Convert duration to a string
        },
      });
      return {
        success: true,
        message: 'Plan updated successfully',
        data: updatedPlan,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllPlansForAUser(userId: number): Promise<ResponseStatus> {
    // find plans for the category of user (candidate or recruiter)
    const user = await this.database.user.findUnique({
      where: {
        id: userId,
      },
    });
    const plans = await this.database.subscription_type.findMany({
      where: {
        category:
          user.roleId === UserRole.CANDIDATE
            ? UserRole.CANDIDATE
            : UserRole.RECRUITER,
      },
    });
    return {
      success: true,
      message: 'Plans retrieved successfully',
      data: plans,
    };
  }
  async FindAllPlansForAUserV2(userId: number) {
    console.log(userId);
  }
  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }
  async pay(userId: number, planId: string) {
    const user = await this.database.personal_details.findFirst({
      where: {
        userId: userId,
      },
    });
    delete user.pin;
    const plan = await this.database.subscription_type.findUnique({
      where: {
        id: Number(planId['planId']),
      },
    });
    // const params = JSON.stringify({
    //   customer: user.email,
    //   plan: plan.planId,
    // });

    // const options = {
    //   hostname: 'api.paystack.co',
    //   port: 443,
    //   path: '/subscription',
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`, // Use the imported PAYSTACK_TEST_SECRET_KEY constant
    //     'Content-Type': 'application/json',
    //   },
    // };

    // const req = https
    //   .request(options, (res) => {
    //     let data = '';

    //     res.on('data', (chunk) => {
    //       data += chunk;
    //     });

    //     res.on('end', () => {
    //       console.log(JSON.parse(data));
    //     });
    //   })
    //   .on('error', (error) => {
    //     console.error(error);
    //   });

    // req.write(params);
    // req.end();
    // return `${userId + '-' + planId}`;
    return {
      success: true,
      message: 'Payment successful',
      data: {
        user,
        plan,
      },
    };
  }
}
