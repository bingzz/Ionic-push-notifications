package push.notif.android;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
public class MyFirebaseMessagingService extends FirebaseMessagingService {

  private static final String TAG = "MyFirebaseMsgService";
    public MyFirebaseMessagingService() {
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
//      TODO: Handle FCM messages here
        Log.d(TAG, "From: " + remoteMessage.getFrom());

//        Check if message contains a data payload
      if (remoteMessage.getData().size() > 0) {
        Log.d(TAG, "Message data payload: " + remoteMessage.getData());

//        Check if data needs to be process by long running job
        if (true) {
          scheduleJob();
        } else {
          handleNow();
        }
      }

      if (remoteMessage.getNotification() != null) {
        Log.d(TAG, "Message Notification Body: " + remoteMessage.getNotification().getBody());
      }
    }

    private void scheduleJob() {
      OneTimeWorkRequest work = new OneTimeWorkRequest.Builder(MyWorker.class).build();
      WorkManager.getInstance(this).enqueue(work);
    }

    private void handleNow() {
      Log.d(TAG, "Short lived task is done");
    }

    public static class MyWorker extends Worker {
      public MyWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
      }

      public Result doWork() {
        return Result.success();
      }
    }
}
