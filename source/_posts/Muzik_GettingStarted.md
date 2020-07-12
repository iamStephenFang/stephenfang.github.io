---
title: Muzik开发总结 — AVAudioPlayer 实践
date: 2020-07-08 19:20:20
categories: 
- tech
tags: 
- iOS
- AudioPlayer
- Swift
copyright: true
---

最近又放弃了使用 Apple Music，作为一个从音乐下载时代过来的人，我仍然保持着将歌曲同步至 iPhone 再聆听的习惯，即使我仍然无法摆脱流媒体的束缚。话说回来，Apple 原生的 Music.app 的体验除了交互，于我而言是糟糕的，我更希望有一款 Tab Based 的 iOS App 支撑这种体验，作为一个有一些 iOS 基础的人，我决定自己开发一个简单的本地音乐播放器，正好学习一些 UIKit 控件。

<!--more-->

## 目的
本系列文章是开发一个简易的音乐播放器（暂时命名为“Muzik”）的博客记录，本篇目的在于实践一个简单的 AVAudioPlayer Demo 模拟 Music.app 的播放功能，内容十分基础。
需要注意的是，此 Demo 并没有采用读取系统音乐资料库需要的 MPMediaPlayer。

## 环境
- Swift 5
- iOS 13.5
- Xcode 11.5

在 Xcode 项目属性的 General 选项卡中点击底部的 Frameworks and Libraries，搜索AVFoundation Framework 将其添加至项目中。

## 歌曲列表界面
为了进行简单的 Demo，我将两首下载好歌曲添加到 Xcode 项目文件夹下，分别为```Song1.mp3```与```Song2.mp3```，并创建简单的结构体命名为 Song：
```swift
struct Song {
    let songName: String
    let albumName: String
    let artistName: String
    let imageName: String
    let trackName: String
}
```
为了在播放时展示专辑封面，我将两首 .mp3 文件的专辑封面添加至 Assets，参照 Song 命名为 Cover1 与 Cover 2。我比较习惯于 AutoLayout 与代码布局共同使用，使用 StoryBoard 进行小项目的简单布局十分方便。
首先，创建一个```ViewController```展示歌曲页面，添加```UITableView```并调整约束，需要将 TableView 对象的 ```Content``` 属性改为 ```Dynamic Prototypes```，将 对象的Cell的 ```Style```属性更改为```Subtitle```，至此 StoryBoard 部分已经完成。
来到与该```ViewController```相对应的```ViewController.swift```文件，由于是在Storyboard中创建```UITableView```，所以需要通过```@IBOutlet```连接之前创建的```UITableView```，方法如Ctrl+拖拽，同时需要在```viewDidLoad()```中设置```UITableView```对象的```delegate```与```dataSource```。需要注意的是使用```UITableView```的方法需要 conforms to 相关的 protocols, 以上均为基本操作。
我需要在```viewDidLoad()```阶段加载歌曲的相关信息，于是创建```configureSongs()```方法为```songs```数组添加相关数据（需要在之前创建）。
尝试完成页面功能布局，作为Demo该 TableView 对象只包含一个 Section 的内容，如果需要调用系统音乐资料库的 ```MPMediaItem```，需要使用 NSRange 对不同 Section 的内容进行排序（A-Z）。为了避免列表中图片大小显示不一致问题，我将 Row 的高度更改为60。在```cellForRowAt```方法中定制 cell，在```didSelectRowAt```方法中令其 present 播放器页面，相关内容在后文中讨论，目前这个页面看起来是这样的(先忽略 Tab 的效果)。
![](http://images.stephenfang.xyz/screen1.png)
懒人代码如下：
```swift
import UIKit

class ViewController: UIViewController, UITableViewDelegate, UITableViewDataSource{
    
    @IBOutlet var songTable: UITableView!
    
    var songs = [Song]()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        configureSongs()
        songTable.delegate = self
        songTable.dataSource = self
    }
    
    func configureSongs() {
        songs.append(Song(songName: "Pretender", albumName: "Pretender", artistName: "Official鬍子男dism", imageName: "Cover1", trackName: "Song1"))
        songs.append(Song(songName: "Imagine", albumName: "The Mango Tree", artistName: "Jack Johnson", imageName: "Cover2", trackName: "Song2"))
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return songs.count
    }
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 60
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let songCell = tableView.dequeueReusableCell(withIdentifier: "songCell", for: indexPath)
        let song = songs[indexPath.row]
        
        songCell.textLabel?.text = song.songName
        songCell.detailTextLabel?.text = song.albumName + "  " + song.artistName
        songCell.imageView?.image = UIImage(named: song.imageName)
        
        return songCell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        let position = indexPath.row
        
        guard let songView = storyboard?.instantiateViewController(identifier: "player") as? PlayerViewController else {
            return
        }
        songView.position = position
        songView.songs = songs
        
        present(songView,animated: true)
    }
    
}
```
    
## 正在播放界面
创建```PlayerViewController```展示正在播放的页面，不需要与任何View进行连接，之后创建一个 UIView 令其紧贴 Safe Area 将其命名为 holder。这次我采用代码进行布局，最终看起来应该是这样的，虽然很不美观但是 it just works。
![](http://images.stephenfang.xyz/screen2.png)。
在开始代码注解前了解一下我的思路。其中```viewDidLayoutSubviews```方法在controller 的子视图的 position 和 size 被改变的时候被调用。在 view 已经被设计 subviews 并且还没有被展示在屏幕上时候，可以调用此方法改变这个view。任何依赖于 bounds 并且需要完成的操作都应该放在```viewDidLayoutSubviews```中而不是```viewDidLoad```或```viewWillAppear```中，因为 view 的 frame 和 bounds 直到 AutoLayout 完成工作的时候才会被确定，所以在执行完Auto Layout之后会调用此方法。
当用户点击上一首歌曲或下一首歌曲按钮后，需要改变控件内容的显示，我的想法是通过调用```removeFromSuperview()```方法，该方法即进行视图节点删除的操作，执行这个方法等于在 View 的树形结构中找到该节点并删除该节点及其子节点，而并非只是删除该节点自己，同时把该对象从响应者链中移除。在ARC的情况下执行```removeFromSuperview```方法多次也没有问题因为由系统自动管理。
那么在调用```removeFromSuperview```后势必需要重新载入页面元素，并且控制播放的过程，这个时候可以采用一个统一的方法在页面载入、切换的时候进行操作。对于 ```AVAudioPlayer```的调用方面，需要导入```AVFoundation```框架并初始化```AVAudioPlayer```对象。由于之前导入了 .mp3 文件，需要做的是让```AVAudioPlayer```获取待播放的歌曲 url，之前的 ViewController 对 Song 的具体内容有定义，而```Bundle.main.path```代表获取工程目录下的文件。系统启动时会激活 ```AVAudioSession```，通过设置```active```为"true"激活 Session，设置为“false”解除 Session 的激活状态，```options```使用 “.notifyOthersOnDeactivation” 使音频会话停用时其它音频会话可以返回到其它活动状态。对于```sharedInstance```包含五种设置方法，希望深入了解的参见这篇文章 [AVAudioSession - Category、Model、Options、Error参数详解](https://www.jianshu.com/p/ae843162ace1)
Int 类型的变量```position```代表当前用户点按的歌曲在 songs 中所处下标，相关的 UIElement 配置都很容易理解不在此赘述，为了模拟 Music.app 的效果，我尝试使用
```swift
 UIView.animate(withDuration: 0.2, animations: {
                self.albumImageView.frame = CGRect(x: 30, y: 30, width: self.holder.frame.size.width - 60, height: self.holder.frame.size.width - 60)
            })
```
实现类似的点击暂停或播放按钮后专辑封面大小变化的的效果，如果页面上已经对元素进行了大小限制使用```CGAffineTransform(scaleX: <CGFloat>, y: <CGFloat>)```也能够达到类似的效果。最后给出此次 Demo 所有的代码，对于播放器的开发进展我会持续更新，🦔本系列的第一篇文章。
```swift
import UIKit
import AVFoundation

class PlayerViewController: UIViewController {
    
    public var position: Int = 0
    public var songs: [Song] = []
    
    @IBOutlet weak var holder: UIView!
    
    var player: AVAudioPlayer?
    let playPauseButton = UIButton()
    
    private let albumImageView: UIImageView = {
        let imageView = UIImageView()
        imageView.contentMode = .scaleAspectFill
        return imageView
    } ()
    
    private let nameLabel: UILabel = {
        let label = UILabel()
        label.textAlignment = .center
        label.numberOfLines = 0
        return label
    } ()
    
    private let albumLabel: UILabel = {
        let label = UILabel()
        label.textAlignment = .center
        label.numberOfLines = 0
        return label
    } ()
    
    private let artistLabel: UILabel = {
        let label = UILabel()
        label.textAlignment = .center
        label.numberOfLines = 0
        return label
    } ()
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        if holder.subviews.count == 0 {
            configurePlayer()
        }
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        if let player = player {
            player.stop()
        }
    }
    
    func configurePlayer() {
        let song = songs[position]
        let urlString = Bundle.main.path(forResource: song.trackName, ofType: ".mp3")
        do {
            try AVAudioSession.sharedInstance().setMode(.default)
            try AVAudioSession.sharedInstance().setActive(true, options: .notifyOthersOnDeactivation)
            
            guard let urlString = urlString else {
                return
            }
            
            player = try AVAudioPlayer(contentsOf: URL(string: urlString)!)
            guard let player = player else {
                return
            }
            player.volume = 0.5
            
            player.play()
        } catch  {
            print("Error occurred")
        }
        
        // UI
        // Album
        albumImageView.frame = CGRect(x: 10,
                                      y: 10,
                                      width: holder.frame.size.width - 20,
                                      height: holder.frame.size.width - 20)
        albumImageView.image = UIImage(named: song.imageName)
        holder.addSubview(albumImageView)
        
        // Label
        nameLabel.frame = CGRect(x: 10, y: albumImageView.frame.size.height + 10, width: holder.frame.size.width - 20 , height: 70)
        albumLabel.frame = CGRect(x: 10, y: albumImageView.frame.size.height + 80, width: holder.frame.size.width - 20 , height: 70)
        artistLabel.frame = CGRect(x: 10, y: albumImageView.frame.size.height + 140, width: holder.frame.size.width - 20 , height: 70)
        
        nameLabel.text = song.songName
        albumLabel.text = song.albumName
        artistLabel.text = song.artistName
        
        holder.addSubview(nameLabel)
        holder.addSubview(albumLabel)
        holder.addSubview(artistLabel)
        
        // Button
        let nextButton = UIButton()
        let backButton = UIButton()
        
        let buttonSize: CGFloat = 50
        
        playPauseButton.frame = CGRect(x: (holder.frame.size.width - buttonSize)/2.0, y: artistLabel.frame.origin.y + 90, width: buttonSize, height: buttonSize)
        nextButton.frame = CGRect(x: holder.frame.size.width - 20 - buttonSize, y: artistLabel.frame.origin.y + 90, width: buttonSize, height: buttonSize)
        backButton.frame = CGRect(x: 20, y: artistLabel.frame.origin.y + 90, width: buttonSize, height: buttonSize)
        
        playPauseButton.addTarget(self, action: #selector(didTapPauseButton), for: .touchUpInside)
        nextButton.addTarget(self, action: #selector(didTapNextButton), for: .touchUpInside)
        backButton.addTarget(self, action: #selector(didTapBackButton), for: .touchUpInside)
        
        playPauseButton.setBackgroundImage(UIImage(systemName: "pause.fill"), for: .normal)
        nextButton.setBackgroundImage(UIImage(systemName: "forward.fill"), for: .normal)
        backButton.setBackgroundImage(UIImage(systemName: "backward.fill"), for: .normal)
        
        playPauseButton.tintColor = .black
        nextButton.tintColor = .black
        backButton.tintColor = .black
        
        holder.addSubview(playPauseButton)
        holder.addSubview(nextButton)
        holder.addSubview(backButton)
        
        // Element
        let slider = UISlider(frame: CGRect(x: 20, y: holder.frame.size.height - 60, width: holder.frame.size.width - 40, height: 50))
        
        slider.value = 50
        slider.addTarget(self, action: #selector(didSlideSlider(_:)), for: .valueChanged)
        holder.addSubview(slider)
        
    }
    
    @objc func didSlideSlider (_ slider: UISlider){
        let value = slider.value
        player?.volume = value
    }
    
    @objc func didTapPauseButton (){
        if player?.isPlaying == true {
            player?.pause()
            playPauseButton.setBackgroundImage(UIImage(systemName: "play.fill"), for: .normal)
            UIView.animate(withDuration: 0.2, animations: {
                self.albumImageView.frame = CGRect(x: 30, y: 30, width: self.holder.frame.size.width - 60, height: self.holder.frame.size.width - 60)
            })
        } else {
            player?.play()
            playPauseButton.setBackgroundImage(UIImage(systemName: "pause.fill"), for: .normal)
            UIView.animate(withDuration: 0.2, animations: {
                self.albumImageView.frame = CGRect(x: 10, y: 10, width: self.holder.frame.size.width - 20, height: self.holder.frame.size.width - 20)
            })
        }
    }
    
    @objc func didTapNextButton (){
        if position < (songs.count - 1 ){
            position = position + 1
            player?.stop()
            for subview in holder.subviews {
                subview.removeFromSuperview()
            }
            configurePlayer()
        }
    }
    
    @objc func didTapBackButton (){
        if position > 0 {
            position = position - 1
            player?.stop()
            for subview in holder.subviews {
                subview.removeFromSuperview()
            }
            configurePlayer()
        }
    }
    
}
```