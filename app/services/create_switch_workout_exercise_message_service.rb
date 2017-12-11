class CreateSwitchWorkoutExerciseMessageService
  attr_accessor :workout, :menu_exercise, :user_id, :messages

  BaseWorkoutMessage = Struct.new(:message, :next_action_type)

  def self.call(workout_id:, next_menu_exercise: nil)
    new(workout_id, next_menu_exercise).call
  end

  def initialize(workout_id, next_menu_exercise)
    @workout = Workout.find(workout_id)
    @menu_exercise = next_menu_exercise
    @user_id = @workout.user_id
    @messages = []
  end

  def call
    last_user_last_exercise_log = UserLastExerciseLog.where(
      user_id: user_id,
      exercise_id: menu_exercise.exercise.id
    )&.last

    return create_whats_your_weight_message if last_user_last_exercise_log.nil?

    workout_exercise = exercises.workout_exercises.where(menu_id: workout.menu_id).first

    messages.push(BaseWorkoutMessage.new(
      "#{haed_message}の種目は#{exercise.name}です",
      WorkoutMessage.next_action_types[:assistant_message]
    ))

    if last_user_last_exercise_log.weight_up?
      messages.push(BaseWorkoutMessage.new(
        "前回#{last_user_last_exercise_log.weight}kgをクリアしました。", "今回は#{last_user_last_exercise_log + 2.5}kgで#{workout_exercise.rep}回#{workout_exercise.set}セット行います。", "それでは1セット目スタート!", "何回できたか教えてください。",
        WorkoutMessage.next_action_types[:user_input_reps]
      ))
    else
      messages.push(BaseWorkoutMessage.new(
        "前回#{last_user_last_exercise_log}kgでした", "今回は#{workout_exercise.rep}回#{workout_exercise.set}セットをクリアできるように頑張りましょう", "それでは1セット目スタート!", "何回できたか教えてください",
        WorkoutMessage.next_action_types[:user_input_reps]
      ))
    end

    create_assistant_messages
  end

  def create_whats_your_weight_message
    head_message = UserExerciseLog.where(user_id: user_id, workout_id: workout.id).present? ? '次の' : '最初の'

    first_message = BaseWorkoutMessage.new(
      "#{head_message}の種目は#{menu_exercise.exercise.name}です",
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
