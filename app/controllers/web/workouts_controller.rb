class Web::WorkoutsController < Web::BaseController
  before_action :authenticate_user!
  before_action :set_workout, :authenticate_workout_user!, only: %i(show)

  def show
    gon.workout_id = @workout.id
    gon.title = "#{@workout.menu.name}のワークアウト"
  end

  def create
    workout = Workout.create!(user_id: current_user.id, menu_id: params[:menu_id])
    redirect_to workout_path(id: workout.id)
  rescue => e
    logger.error e
    redirect_to root_path
  end

  private

  def set_workout
    @workout = Workout.find(params[:id])
  end

  def authenticate_workout_user!
    return if current_user.id == @workout.user_id

    render_404
  end
end
