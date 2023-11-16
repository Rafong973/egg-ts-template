require('module-alias/register')
import BaseService from '@base/baseService'
import { GetTestQuery, PostTestParams } from '@schema/controller/test'

export default class TestService extends BaseService {
  public async postTest({ id, users }: PostTestParams) {
    return {
      id,
      users
    }
  }

  public async getTest({ id }: GetTestQuery) {
    return {
      id
    }
  }
}
