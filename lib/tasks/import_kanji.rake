require 'csv'
# lib/tasks/import_kanji.rake
task import_kanji: :environment do
  CSV.foreach("#{Rails.root}/lib/kanji.csv", :headers => true) do |row|
    Kanji.create!(row.to_hash)
  end
end