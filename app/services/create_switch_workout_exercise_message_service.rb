class CreateSwitchWorkoutExerciseMessageService
  attr_accessor :workout, :menu_exercise, :user_id, :messages

  BaseWorkoutMessage = Struct.new(:message, :next_action_type)

  def self.call(workout_id:, next_menu_exercise_id: nil)
    new(workout_id, next_menu_exercise_id).call
  end

  def initialize(workout_id, next_menu_exercise_id)
    @workout = Workout.find(workout_id)
    @menu_exercise = MenuExercise.find(next_menu_exercise_id)
    @user_id = @workout.user_id
    @messages = []
  end

  def call
    last_user_last_exercise_log = UserLastExerciseLog.where(
      user_id: user_id,
      exercise_id: menu_exercise.exercise.id
    )&.last

    return create_whats_your_weight_message if last_user_last_exercise_log.nil? || last_user_last_exercise_log.weight.zero?

    exercise = menu_exercise.exercise

    head_message = UserExerciseLog.where(user_id: user_id, workout_id: workout.id).present? ? '次の' : '最初の'

    previouse_exercise_workout_id = UserExerciseLog.where.not(workout_id: workout.id).where(user_id: user_id, exercise_id: menu_exercise.exercise_id).order(id: :desc).first.workout_id

    last_exercise_logs = UserExerciseLog.where(workout_id: previouse_exercise_workout_id, exercise_id: menu_exercise.exercise_id).order(id: :asc).each_with_object([]) do |user_exercise_log, array|
      array.push("#{user_exercise_log.weight}kg/#{user_exercise_log.reps}rep")
    end.join(', ')

    messages.push(BaseWorkoutMessage.new(
      "OK!#{head_message}種目は#{exercise.name}です",
      WorkoutMessage.next_action_types[:assistant_message]
    ))

    messages.push(BaseWorkoutMessage.new(
      "前回の記録は\n#{last_exercise_logs}\nでした",
      WorkoutMessage.next_action_types[:assistant_message]
    ))

    messages.push(BaseWorkoutMessage.new(
        "それでは1セット目スタート!何回できたか教えてください",
      WorkoutMessage.next_action_types[:user_input_reps]
    ))

    create_assistant_messages
  end

  def create_whats_your_weight_message
    head_message = UserExerciseLog.where(user_id: user_id, workout_id: workout.id).present? ? '次の' : '最初の'

    first_message = BaseWorkoutMessage.new(
      "OK!#{head_message}種目は#{menu_exercise.exercise.name}です",
      WorkoutMessage.next_action_types[:assistant_message]
    )
    second_message = BaseWorkoutMessage.new(
      '今回挑戦する重さを教えてください',
      WorkoutMessage.next_action_types[:user_input_weight]
    )

    messages.push(first_message, second_message)

    create_assistant_messages
  end

  def create_assistant_messages
    messages.each do |message|
      workout_message = WorkoutMessage.new(
        workout_id: workout.id,
        message: message.message,
        message_type: WorkoutMessage.message_types[:assistant],
        next_action_type: message.next_action_type
      )

      if new_workout_message?
        workout_message.save!
        next
      end

      workout_message.parent_id = last_workout_message.id
      workout_message.save!
    end
  end

  def new_workout_message?
    !WorkoutMessage.where(workout_id: workout.id).exists?
  end

  def last_workout_message
    WorkoutMessage.where(workout_id: workout.id).last
  end
end
