class Kanji < ApplicationRecord
  has_and_belongs_to_many :lists
  
  scope :random, -> { order("RANDOM()") }
  
  scope :filter, lambda { |options|
    if Kanji::LEVEL_OPTIONS.flatten.include?(options[:filter]) && options[:level]
      where("#{options[:filter]}_level = ?", options[:level])
    elsif Kanji::CATEGORY_OPTIONS.flatten.include?(options[:filter])
      where("category = ?", options[:filter])
    elsif List.exists?(options[:filter])
      joins(:kanjis_lists).where('kanjis_lists.list_id' => options[:filter])
    end
  }
  
  scope :search, lambda { |query|
    return nil if query.blank?
    terms = query.downcase.split(/\s+/)
    terms = terms.map { |e|
      ('%'+e.gsub('*', '%') + '%').gsub(/%+/, '%')
    }
    num_or_conds = 4
    where(
      terms.map { |term|
        "(kanjis.character LIKE ? OR LOWER(kanjis.meaning) LIKE ? OR kanjis.onyomi LIKE ? OR kanjis.kunyomi LIKE ?)"
      }.join(' AND '),
      *terms.map { |e| [e] * num_or_conds }.flatten
    )
  }
  
  LEVEL_OPTIONS = [
    ['Jōyō Grade', 'joyo'],
    ['JLPT Level', 'jlpt'],
    ['WaniKani Level', 'wk']
  ]
  CATEGORY_OPTIONS = [
    ['Jōyō', 'jōyō'],
    ['Jinmeiyō', 'jinmeiyō'],
    ['Hyōgai', 'hyōgai']
  ]
end
