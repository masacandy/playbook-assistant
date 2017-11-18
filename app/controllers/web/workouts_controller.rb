class Web::WorkoutsController < Web::BaseController
  def show
    @workout = Workout.find(params[:id])
    gon.workout_id = params[:id]
  end

  def create
    workout = Workout.create!(user_id: current_user.id, menu_id: params[:menu_id])
    redirect_to workout_path(id: workout.id)
  rescue => e
    logger.error e
    redirect_to root_path
  end
end
