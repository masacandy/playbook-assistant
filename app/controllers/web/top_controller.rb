class Web::TopController < Web::BaseController
  def index
    @menus = current_user.menus
  end
end
