import { Controller, Get, Patch } from '@nestjs/common';

@Controller('recruiter')
export class RecruiterController {
  // TODO
  // Add candidate to favorite
  @Patch('favorite/add')
  addCandidateToFavorite() {
    // TODO
  }
  // get all favorite candidates
  @Get('favorite')
  getFavoriteCandidates() {
    // TODO
  }
  // remove candidate from favorite
  @Patch('favorite/remove')
  removeCandidateFromFavorite() {
    // TODO
  }
}
