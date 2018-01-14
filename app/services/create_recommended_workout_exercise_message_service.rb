class CreateRecommendedWorkoutExerciseMessageService
  attr_accessor :workout

  def self.call(workout_id:)
    new(workout_id).call
  end

  def initialize(workout_id)
    @workout = Workout.find(workout_id)
  end

  def call
    recommend_exercise = ::FetchUnfinishedExercisesService.call(workout_id: workout.id)&.first

    head_message = first_exercise?(recommend_exercise) ? '最初の' : '次の'

    WorkoutMessage.create!(
      workout_id: workout.id,
      message: "#{head_message}種目は#{recommend_exercise.name}がおすすめです",
      message_type: WorkoutMessage.message_types[:assistant],
      next_action_type: WorkoutMessage.next_action_types[:assistant_message],
    )

    WorkoutMessage.create!(
      workout_id: workout.id,
      message: "#{recommend_exercise.name}を行いますか？",
      message_type: WorkoutMessage.message_types[:assistant],
      next_action_type: WorkoutMessage.next_action_types[:user_choose_exercise],
    )
  end

  private

  def first_exercise?(recommend_exercise)
    recommend_exercise == workout.menu.menu_exercises.order(sort: :asc).first
  end
end
