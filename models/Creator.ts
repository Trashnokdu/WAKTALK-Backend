import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'Creator', timestamps: false })
export class Creator extends Model<Creator> {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    primaryKey: true,
  })
  classificationId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING(300),
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  salt: string;

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

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  instargramId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  afreecaId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  youtubeId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  twitterId: string;
}
