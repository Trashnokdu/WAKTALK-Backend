import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'User', timestamps: false })
export class User extends Model<User> {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  nickname: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  phone: string;
}
