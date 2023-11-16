require('module-alias/register')
import BaseController from '@base/baseController'
import { HwController, GET, POST, Params, Query } from '@lib/hwRouter'
const __CURCONTROLLER = __filename.substr(__filename.indexOf('/app/controller')).replace('/app/controller', '').split('.')[0].toLowerCase()
import { GetTestQuery, PostTestParams } from '@schema/controller/test'
import { Validate } from 'class-validator-helper'

@HwController(__CURCONTROLLER)
export default class userController extends BaseController {
  @POST('/')
  @Params({
    id: [],
    users: []
  })
  public async postTest() {
    const testService = this.ctx.service.test
    const params: PostTestParams = this.ctx.filterParams
    await Validate(PostTestParams, params)
    const result = await testService.postTest(params)
    this.returnSuccess(result)
  }

  @GET('/')
  @Query({
    id: [Number]
  })
  public async getTest() {
    const testService = this.ctx.service.test
    const query = this.ctx.filterQuery
    await Validate(GetTestQuery, query)
    const result = await testService.getTest(query)
    this.returnSuccess(result)
  }
}
