class FinishWorkoutService
  attr_accessor :workout

  def self.call(workout_id:)
    new(workout_id).call
  end

  def initialize(workout_id)
    @workout = Workout.find(workout_id)
  end

  def call
    workout.update(finished_at: Time.current)
    create_finish_message
  end

  private

  def create_finish_message
    WorkoutMessage.create!(
      workout_id: workout.id,
      message: '今日のワークアウトはこれで終わりだ。',
      message_type: WorkoutMessage.message_types[:assistant],
      next_action_type: WorkoutMessage.next_action_types[:assistant_message],
    )

    WorkoutMessage.create!(
      workout_id: workout.id,
      message: 'ワークアウトは継続が鍵だ！また会う日まで',
      message_type: WorkoutMessage.message_types[:assistant],
      next_action_type: WorkoutMessage.next_action_types[:finish_workout],
    )
  end
end
