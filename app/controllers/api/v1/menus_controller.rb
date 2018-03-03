class Api::V1::MenusController < Api::V1::BaseController
  before_action :authenticate_user!

  def show
    @menu = Menu.find(params[:id])
  end
end
