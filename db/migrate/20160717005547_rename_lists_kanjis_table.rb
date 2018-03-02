class RenameListsKanjisTable < ActiveRecord::Migration[5.0]
  def change
    rename_table :lists_kanjis, :kanjis_lists
  end
end
