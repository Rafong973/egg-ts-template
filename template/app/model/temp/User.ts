import { Model, Table, Column, AutoIncrement, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript'

@Table({
  modelName: 'user'
})
class User extends Model<User> {
  paranoid: true

  @AutoIncrement
  @Column({
    primaryKey: true
  })
  id: number

  @Column
  openid: string

  @Column
  nickname: string

  @Column
  avatarUrl: string

  @CreatedAt
  @Column({
    field: 'created_at'
  })
  createdAt: Date

  @UpdatedAt
  @Column({
    field: 'updated_at'
  })
  updatedAt: Date

  @DeletedAt
  @Column({
    field: 'deleted_at'
  })
  deletedAt: Date
}

export default () => User
