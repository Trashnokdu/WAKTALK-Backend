import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Artist extends Model<Artist> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;
}
