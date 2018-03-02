class ListsController < ApplicationController
  
  before_action :authenticate_user!
  before_action :set_list, only: [:show, :edit, :update, :destroy]
  before_action :check_owner, only: [:show, :edit, :update, :destroy]
  
  def index
    @lists = List.where(user_id: current_user.id)
  end
  
  def show
    @kanji = @list.kanjis.page(params[:page])
  end
  
  def new
    @list = List.new
  end
  
  def edit
  end
  
  def create
    @list = List.new(list_params.merge({:user_id => current_user.id}))
    if @list.save
      redirect_to @list, notice: "List was successfully created."
    else
      render :new
    end
  end
  
  def update
    if @list.update(list_params)
      redirect_to @list, notice: "List was successfully updated."
    else
      render :edit
    end
  end
  
  def destroy
    @list.destroy
    redirect_to lists_path, notice: "List was successfully deleted."
  end
  
  private
  
  def set_list
    @list = List.find(params[:id])
  end
  
  def check_owner
    redirect_to :root_path if @list.user_id != current_user.id
  end
  
  def list_params
    params.require(:list).permit(:name, :characters)
  end
end