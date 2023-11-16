import { IsNumber, IsNotEmpty, IsString, ArrayMaxSize, ArrayMinSize, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class PostTestParams$User {
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  mobile: string
}

export class GetTestQuery {
  @IsNumber()
  @IsNotEmpty()
  id: number
}

export class PostTestParams {
  @IsNumber()
  @IsNotEmpty()
  id: number

  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PostTestParams$User)
  users: []
}
