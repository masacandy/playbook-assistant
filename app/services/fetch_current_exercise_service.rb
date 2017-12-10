class FetchCurrentExerciseService
  attr_accessor :workout

  CurrentExercise = Struct.new(:id, :rep, :latest_weight)

  def self.call(workout_id:)
    new(workout_id).call
  end

  def initialize(workout_id)
    @workout = Workout.find(workout_id)
  end

  def call
    exercise = Menu.find(workout.menu_id).menu_exercises.first

    latest_weight = workout.user.user_last_exercise_logs.where(exercise_id: exercise.id)&.last&.weight
    CurrentExercise.new(exercise.id, exercise.rep, latest_weight)
  end
end
