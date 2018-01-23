class Api::V1::BaseController < ApplicationController
  before_action :authenticate_user!

  def authenticate_workout_user!
    workout = Workout.find(params[:workout_id])
    return if current_user.id == workout.user_id

    render json {}, status: 401
  end

  def authenticate_workout_user_from_id!
    workout = Workout.find(params[:id])
    return if current_user.id == workout.user_id

    render json {}, status: 401
  end
end
