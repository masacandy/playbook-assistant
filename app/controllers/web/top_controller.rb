class Web::TopController < Web::BaseController
  def index
    gon.logged = current_user.present?

    return if current_user.nil?

    gon.user_menus = current_user.menus
  end
end
