package com.wegas.watson;

import com.ibm.watson.developer_cloud.conversation.v1.ConversationService;
import com.ibm.watson.developer_cloud.conversation.v1.model.MessageRequest;
import com.ibm.watson.developer_cloud.conversation.v1.model.MessageResponse;
import com.wegas.core.Helper;

/**
 *
 * @author marvin
 */


public class Watson {
    
    public static final String USERNAME = Helper.getWegasProperty("watson.username");
    
    public static final String PASSWORD = Helper.getWegasProperty("watson.password");;
    
    public static void main(String... args){
        ConversationService service = Watson.init();
        
        MessageRequest newMessage = new MessageRequest.Builder().inputText("Fumes-tu?")
        // Replace with the context obtained from the initial request
        //.context(...)
        .build();

        String workspaceId = "06c9293f-4722-4bd3-8d46-3d18bfb3d671";
        
        MessageResponse response = service
        .message(workspaceId, newMessage)
        .execute();

        System.out.println(response);
    }
    
    public static ConversationService init(){
        ConversationService service = new ConversationService(Helper.getWegasProperty("watson.version"));
        service.setUsernameAndPassword(Watson.USERNAME,Watson.PASSWORD);
        return service;
    }
}
