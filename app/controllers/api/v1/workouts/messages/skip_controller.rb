class Api::V1::Workouts::Messages::SkipController < Api::V1::BaseController
  before_action :authenticate_workout_user!

  ZERO_WEIGHT = 0
  ZERO_REPS = 0

  def create
    @workout = Workout.find(params[:workout_id])
    exercise = Exercise.find(params[:exercise_id])

    last_exercise_log = @workout&.user_exercise_logs&.where(exercise_id: exercise.id)&.last

    ActiveRecord::Base.transaction do
      if last_exercise_log.present?
        create_user_last_exercise_log(exercise_id: exercise.id, weight: last_exercise_log.weight)
        WorkoutMessage.create!(
          workout_id: @workout.id,
          message: "#{exercise.name}を終了します",
          message_type: WorkoutMessage.message_types[:user],
          next_action_type: WorkoutMessage.next_action_types[:assistant_message],
        )
      else
        WorkoutMessage.create!(
          workout_id: @workout.id,
          message: "#{exercise.name}をスキップします",
          message_type: WorkoutMessage.message_types[:user],
          next_action_type: WorkoutMessage.next_action_types[:assistant_message],
        )
      end

      ::CreateRecommendedWorkoutExerciseMessageService.call(workout_id: @workout.id)
    end

    @current_exercise = OpenStruct.new(
      id: next_menu_exercise&.exercise_id,
      rep: next_menu_exercise&.rep,
    )

    @weight = nil
  end

  private

  def create_user_last_exercise_log(exercise_id:, weight:)
    UserLastExerciseLog.create!(
      user_id: current_user.id,
      exercise_id: exercise_id,
      weight: weight,
      weight_up: false,
    )
  end

  def next_menu_exercise
    recommend_next_exercise = ::FetchUnfinishedExercisesService.call(workout_id: @workout.id).first
    @workout.menu.menu_exercises.find_by(exercise_id: recommend_next_exercise.id)
  end
end
