module KanjiHelper
  def svg(name)
    file_path = "#{Rails.root}/app/assets/images/kanjivg/#{name}.svg"
    return File.read(file_path).match(/<svg.+/m).to_s.html_safe if File.exists?(file_path)
    "(KanjiVG #{name} Not Found)"
  end
  
  def filter_options
    opt = [
      ['Category', Kanji::CATEGORY_OPTIONS],
      ['Level', Kanji::LEVEL_OPTIONS]
    ]
    opt.push ['Your List', current_user.lists.collect { |l| [l.name, l.id] }] if current_user
    opt
  end
end
