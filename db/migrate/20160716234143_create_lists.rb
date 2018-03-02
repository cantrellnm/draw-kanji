class CreateLists < ActiveRecord::Migration[5.0]
  def change
    create_table :lists do |t|
      t.belongs_to :user, index: true
      t.string :name, null: false, default: ""
      t.timestamps
    end
    
    create_table :lists_kanjis, id: false do |t|
      t.belongs_to :list, index: true
      t.belongs_to :kanji, index: true
    end
  end
end
