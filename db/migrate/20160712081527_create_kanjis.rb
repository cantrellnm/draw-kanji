class CreateKanjis < ActiveRecord::Migration[5.0]
  def change
    create_table :kanjis do |t|
      t.string :character, index: true, unique: true, null: false
      t.string :category
      t.string :meaning
      t.string :onyomi
      t.string :kunyomi
      t.integer :joyo_level
      t.string :jlpt_level
      t.integer :wk_level
      
      t.timestamps
    end
  end
end
