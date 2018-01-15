class Api::V1::Workouts::Messages::Exercises::UnfinishedController < Api::V1::BaseController
  def index
    done_exercise_ids = UserExerciseLog.where(user_id: current_user.id, workout_id: params[:workout_id]).pluck(:exercise_id).uniq
    menu_exercise_ids = MenuExercise.where(menu_id: params[:menu_id]).where.not(exercise_id: done_exercise_ids).pluck(:id)
    @exercises = Exercise.where(id: menu_exercise_ids)
  end
end
