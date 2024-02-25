import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'WaitingCreator', timestamps: false })
export class WaitingCreator extends Model<WaitingCreator> {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    primaryKey: true,
  })
  uuid: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  classificationId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  color: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  displayName: string;
}
