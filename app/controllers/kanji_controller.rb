class KanjiController < ApplicationController
  def home
    if filter_params[:random]
      @k = Kanji.filter(filter_params).random
                .first    
    else
      @page = filter_params[:page] ? filter_params[:page].to_i : 1
      @total = Kanji.filter(filter_params).size
      @page = 1 if @page > @total
      @k = Kanji.filter(filter_params)
                .offset(@page - 1).limit(1).first
    end
    
    respond_to do |format|
      format.html
      format.js
    end
  end
  
  def about
  end
  
  def index
    @kanji = Kanji.filter(filter_params)
                  .search(filter_params[:query])
                  .page(params[:page])
    respond_to do |format|
      format.html
      format.js
    end
  end
  
  def show
    @k = Kanji.find_by(character: params[:character])
  end
  
  private
  
  def filter_params
    params.permit(:random, :filter, :level, :query, :_, :utf8, :page, :commit)
  end
end
