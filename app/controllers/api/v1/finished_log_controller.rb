class Api::V1::FinishedLogController < Api::V1::BaseController
  before_action :authenticate_workout_user!

  WorkoutLog = Struct.new(:name, :sets)
  WorkoutSets = Struct.new(:weight, :rep)

  def index
    @workout_log = create_workout_log
  end

  private

  def create_workout_log
    workout = Workout.find(params[:workout_id])

    workout.user_exercise_logs.order(id: :asc).each_with_object({}) do |log, hash|
      if hash.key?(log.exercise_id)
        current_sets = hash[log.exercise_id][:sets]
        hash[log.exercise_id][:sets] = current_sets.push(WorkoutSets.new(log.weight, log.reps))
      else
        name = Exercise.find(log.exercise_id).name
        hash[log.exercise_id] = {
          name: name,
          sets: [WorkoutSets.new(log.weight, log.reps)],
        }
      end
    end
  end
end
