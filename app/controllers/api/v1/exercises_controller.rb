class Api::V1::ExercisesController < Api::V1::BaseController
  before_action :authenticate_user!

  def show
    @exercise = Exercise.find(params[:id])
  end
end
