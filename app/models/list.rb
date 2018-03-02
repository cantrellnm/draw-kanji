class List < ApplicationRecord
  has_and_belongs_to_many :kanjis
  
  attr_writer :characters
  after_save :set_kanji
  
  def characters
    @characters || kanjis.map(&:character).join(', ')
  end
  
  protected
  
  def set_kanji
    self.kanjis = @characters.split(/[,\s]+/).map { |char| Kanji.find_by(character: char) }.compact
  end
end
