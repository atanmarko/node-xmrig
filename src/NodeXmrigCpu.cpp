

#include "NodeApp.h"
#include "NodeXmrigCpu.h"

#include <iostream>



Nan::Persistent<v8::FunctionTemplate> NodeXmrigCpu::constructor;

NAN_MODULE_INIT(NodeXmrigCpu::Init) {
        v8::Local<v8::FunctionTemplate> ctor = Nan::New<v8::FunctionTemplate>(NodeXmrigCpu::New);
        constructor.Reset(ctor);
        ctor->InstanceTemplate()->SetInternalFieldCount(1);
        ctor->SetClassName(Nan::New("NodeXmrigCpu").ToLocalChecked());

        // link our getters and setter to the object property
        Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("jsonConfig").ToLocalChecked(), NodeXmrigCpu::HandleGetters, NodeXmrigCpu::HandleSetters);
        Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("rewardAddress").ToLocalChecked(), NodeXmrigCpu::HandleGetters, NodeXmrigCpu::HandleSetters);

        Nan::SetPrototypeMethod(ctor, "startMining", startMining);
        Nan::SetPrototypeMethod(ctor, "stopMining", stopMining);
        Nan::SetPrototypeMethod(ctor, "getStatus", getStatus);
        Nan::SetPrototypeMethod(ctor, "reloadConfig", reloadConfig);



        target->Set(Nan::New("NodeXmrigCpu").ToLocalChecked(), ctor->GetFunction());
}

NAN_METHOD(NodeXmrigCpu::New) {
        // throw an error if constructor is called without new keyword
        if(!info.IsConstructCall()) {
          return Nan::ThrowError(Nan::New("NodeXmrigCpu::New - called without new keyword").ToLocalChecked());
        }

        // expect exactly 2 arguments
        if(info.Length() != 1) {
          return Nan::ThrowError(Nan::New("NodeXmrigCpu::New - expected argument jsonConfig").ToLocalChecked());
        }

        // expect arguments to be numbers
        if(!info[0]->IsString()) {
          return Nan::ThrowError(Nan::New("NodeXmrigCpu::New - expected arguments to be one configuration string").ToLocalChecked());
        }

        Nan::Utf8String configUtf8Value(info[0]);
        int len = configUtf8Value.length();
        std::string jsonConfig = std::string(*configUtf8Value, len);

        // create a new instance and wrap our javascript instance
        NodeXmrigCpu* miner = new NodeXmrigCpu(jsonConfig);
        miner->Wrap(info.Holder());
        
        // return the wrapped javascript instance
        info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(NodeXmrigCpu::startMining) {
        // unwrap this NodeXmrigCpu
        NodeXmrigCpu *self = Nan::ObjectWrap::Unwrap<NodeXmrigCpu>(info.This());

        self->minerApp->exec();

        info.GetReturnValue().Set(Nan::New("true").ToLocalChecked());
}

NAN_METHOD(NodeXmrigCpu::stopMining) {
        NodeXmrigCpu *self = Nan::ObjectWrap::Unwrap<NodeXmrigCpu>(info.This());

        self->minerApp->close();

        info.GetReturnValue().Set(Nan::New("true").ToLocalChecked());
}


NAN_METHOD(NodeXmrigCpu::reloadConfig) {
        NodeXmrigCpu *self = Nan::ObjectWrap::Unwrap<NodeXmrigCpu>(info.This());

        Nan::Utf8String configUtf8Value(info[0]);
        int len = configUtf8Value.length();
        std::string jsonConfig = std::string(*configUtf8Value, len);

        self->minerApp->reloadConfig(jsonConfig);

        info.GetReturnValue().Set(Nan::New("true").ToLocalChecked());
}

NAN_METHOD(NodeXmrigCpu::getStatus) {
        // unwrap this NodeXmrigCpu
        NodeXmrigCpu *self = Nan::ObjectWrap::Unwrap<NodeXmrigCpu>(info.This());

        std::string result = self->minerApp->getStatus();

        info.GetReturnValue().Set(Nan::New(result).ToLocalChecked());
}

NAN_GETTER(NodeXmrigCpu::HandleGetters) {
        NodeXmrigCpu* self = Nan::ObjectWrap::Unwrap<NodeXmrigCpu>(info.This());

        std::string propertyName = std::string(*Nan::Utf8String(property));
        if (propertyName == "jsonConfig") {
          v8::Local<v8::Value> returnValue = Nan::CopyBuffer((char*)self->jsonConfig.c_str(), self->jsonConfig.size()).ToLocalChecked();
          info.GetReturnValue().Set(returnValue);
        } else {
          info.GetReturnValue().Set(Nan::Undefined());
        }
}

NAN_SETTER(NodeXmrigCpu::HandleSetters) {
        NodeXmrigCpu* self = Nan::ObjectWrap::Unwrap<NodeXmrigCpu>(info.This());

        if(!value->IsString()) {
          return Nan::ThrowError(Nan::New("expected value to be a string").ToLocalChecked());
        }

}